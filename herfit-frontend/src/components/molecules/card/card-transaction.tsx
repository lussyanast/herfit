import { Badge } from '@/components/atomics/badge';
import { Button } from '@/components/atomics/button';
import { CityTransactionProps } from '@/interfaces/city-transaction';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineClock } from 'react-icons/hi';

function CardTransaction({
  id,
  kode,
  image,
  title,
  days,
  price,
  status
}: CityTransactionProps & { kode: string }) {
  return (
    <figure className="flex items-center justify-between bg-white rounded-3xl p-4 border border-border shadow-indicator">
      <div className="flex items-center space-x-4">
        <Image
          src={image}
          alt={title}
          height={0}
          width={0}
          className="w-[120px] h-[90px] rounded-2xl object-cover"
          unoptimized
        />

        <div>
          <div className="flex gap-4 items-center">
            <h1 className="font-bold leading-8 text-secondary lg:text-base text-sm">
              {title}
            </h1>
            {status === 'waiting' && (
              <Badge variant="waiting">{status}</Badge>
            )}
            {status === 'approved' && (
              <Badge variant="approved">{status}</Badge>
            )}
            {status === 'rejected' && (
              <Badge variant="rejected">{status}</Badge>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2.5">
              <div className="flex items-center text-sm font-semibold leading-[21px]">
                <HiOutlineClock className="w-5 h-5 mr-1" />
                {days} hari
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold leading-[21px] text-gray-800">
                <span>Rp. 
                  {(price ?? 0).toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <Link href={`/booking-success/${kode}/success`}>
                <Button variant="third" size="header">
                  Preview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

export default CardTransaction;