import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/portfolio');
  return null; // Or a loading spinner if preferred before redirect
}
