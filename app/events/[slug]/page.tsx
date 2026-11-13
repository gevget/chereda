import {EventDetailPage} from '@/components/pages/events-page';
export function generateStaticParams(){return [{slug:'garden-talk'},{slug:'light-lab'},{slug:'visual-brief-online'},{slug:'autumn-project-review'}]}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <EventDetailPage slug={slug}/>}
