import {redirect} from 'next/navigation';

export default function Home(){
  redirect('/feed?tab=for-you');
}
