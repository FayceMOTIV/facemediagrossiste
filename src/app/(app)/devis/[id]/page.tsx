import DevisEditorClient from './DevisEditorClient';

// generateStaticParams for static export - pre-render the "nouveau" path
export function generateStaticParams() {
  return [
    { id: 'nouveau' },
  ];
}

export default function DevisEditorPage({ params }: { params: { id: string } }) {
  return <DevisEditorClient devisId={params.id} />;
}
