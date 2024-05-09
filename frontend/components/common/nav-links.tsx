"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { WalletCards } from 'lucide-react';



// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: WalletCards
  },
];

export default function NavLinks() {

	  const pathname = usePathname();

  return (
    <div className='space-y-2 mt-4'>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-aqua hover:text-black md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-[#35F1CE] text-black': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="block">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
