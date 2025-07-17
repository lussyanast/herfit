export interface CityTransactionProps {
  id: number;
  image: string;
  title: string;
  days: number;
  price: number;
  status: 'waiting' | 'approved' | 'rejected';
}
