export interface CityTransactionProps {
  id: number;
  kode: string;
  image: string;
  title: string;
  days: number;
  price: number;
  status: 'waiting' | 'approved' | 'rejected';
}