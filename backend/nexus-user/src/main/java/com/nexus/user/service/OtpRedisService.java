package com.nexus.user.service;

import com.nexus.common.api.ErrorCode;
import com.nexus.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpRedisService {

    private static final String KEY_PREFIX_CODE = "otp:code:";
    private static final String KEY_PREFIX_COOLDOWN = "otp:cooldown:";
    private static final String KEY_PREFIX_ATTEMPTS = "otp:attempts:";

    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final Duration COOLDOWN_TTL = Duration.ofSeconds(60);
    private static final int MAX_ATTEMPTS = 5;

    private static final SecureRandom RANDOM = new SecureRandom();

    private final StringRedisTemplate redisTemplate;
    private final PasswordEncoder passwordEncoder;

    /**
     * Tạo mã 6 chữ số ngẫu nhiên.
     */
    public String generateCode() {
        int code = 100_000 + RANDOM.nextInt(900_000);
        return String.valueOf(code);
    }

    /**
     * Kiểm tra cooldown 60s. Nếu còn hạn thì ném lỗi, nếu không thì lưu OTP mới vào Redis.
     */
    public void saveOtp(String email, String rawOtp) {
        String cooldownKey = KEY_PREFIX_COOLDOWN + email;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(cooldownKey))) {
            Long expire = redisTemplate.getExpire(cooldownKey);
            throw new BusinessException(ErrorCode.BAD_REQUEST,
                    "Vui lòng đợi " + (expire != null ? expire : 60) + " giây trước khi yêu cầu mã mới");
        }

        String codeKey = KEY_PREFIX_CODE + email;
        String attemptsKey = KEY_PREFIX_ATTEMPTS + email;

        // Lưu hash của OTP với TTL 5 phút
        redisTemplate.opsForValue().set(codeKey, passwordEncoder.encode(rawOtp), OTP_TTL);
        // Thiết lập cooldown 60 giây
        redisTemplate.opsForValue().set(cooldownKey, "1", COOLDOWN_TTL);
        // Reset bộ đếm lần thử
        redisTemplate.delete(attemptsKey);

        log.info("[OTP REDIS] Đã lưu OTP cho email: {} (hết hạn trong {} phút)", email, OTP_TTL.toMinutes());
    }

    /**
     * Xác thực OTP trong Redis với cơ chế chống Brute Force (tối đa 5 lần thử).
     */
    public void validateOtp(String email, String rawOtp) {
        String codeKey = KEY_PREFIX_CODE + email;
        String attemptsKey = KEY_PREFIX_ATTEMPTS + email;

        String hashedOtp = redisTemplate.opsForValue().get(codeKey);
        if (hashedOtp == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Mã OTP không hợp lệ hoặc đã hết hạn");
        }

        // Tăng số lần thử
        Long attempts = redisTemplate.opsForValue().increment(attemptsKey);
        if (attempts != null && attempts == 1) {
            redisTemplate.expire(attemptsKey, OTP_TTL);
        }

        if (attempts != null && attempts > MAX_ATTEMPTS) {
            // Vượt quá số lần thử -> Hủy mã ngay lập tức
            redisTemplate.delete(codeKey);
            redisTemplate.delete(attemptsKey);
            throw new BusinessException(ErrorCode.UNAUTHORIZED,
                    "Mã OTP đã bị khóa do nhập sai quá " + MAX_ATTEMPTS + " lần. Vui lòng yêu cầu mã mới");
        }

        // Kiểm tra khớp mã
        if (!passwordEncoder.matches(rawOtp, hashedOtp)) {
            int remaining = MAX_ATTEMPTS - (attempts != null ? attempts.intValue() : 1);
            throw new BusinessException(ErrorCode.UNAUTHORIZED,
                    "Mã OTP không chính xác. Còn lại " + Math.max(0, remaining) + " lần thử");
        }

        // Xác thực thành công -> Xóa các key liên quan khỏi Redis
        redisTemplate.delete(List.of(codeKey, attemptsKey, KEY_PREFIX_COOLDOWN + email));
        log.info("[OTP REDIS] Xác thực thành công cho email: {}", email);
    }
}
