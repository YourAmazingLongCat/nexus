import { useEffect, useState } from 'react';
import { listCatalogProducts, listAuctions, type Listing } from '../../../services/api/catalog';
import { apiErrorMessage } from '../../../services/api/client';
import { notify } from '../../../shared/components/Toast';
export function useHomeProducts(auction = false) {
 const [products, setProducts] = useState<Listing[]>([]);
 const [loading, setLoading] = useState(true); const [error, setError] = useState('');
 useEffect(() => { const controller = new AbortController(); setLoading(true);
 const request = auction ? listAuctions(new URLSearchParams({ status: 'ACTIVE', page: '0', size: '12', sort: 'endTime,asc' }), controller.signal) : listCatalogProducts({ status: 'ACTIVE', size: 12, page: 0, sort: 'createdAt,desc' }, controller.signal);
 request.then(page => setProducts(page.content)).catch(error => { if (!controller.signal.aborted) { setError(apiErrorMessage(error)); notify.error(apiErrorMessage(error)); } }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
 return () => controller.abort(); }, [auction]); return { products, loading, error };
}
