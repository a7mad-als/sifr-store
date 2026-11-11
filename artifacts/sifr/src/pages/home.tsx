import { useListBooks, getListBooksQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Catalogue } from '@/components/catalogue';
import { Benefits, Bestsellers, Categories, Contact, DarTaqwa, FeaturedRelease, Hero, ShipTo } from '@/components/home-sections';
import { Partners } from '@/components/partners';

export default function Home() {
  const { data: books, isLoading, isError } = useListBooks({ query: { queryKey: getListBooksQueryKey() } });
  const qc = useQueryClient();
  const retry = () => qc.invalidateQueries({ queryKey: getListBooksQueryKey() });
  return (
    <>
      <Hero books={books} />
      <Benefits />
      <FeaturedRelease books={books} isLoading={isLoading} />
      <Bestsellers books={books} isLoading={isLoading} />
      <Categories books={books} />
      <Catalogue books={books} isLoading={isLoading} isError={isError} onRetry={retry} />
      <DarTaqwa books={books} />
      <ShipTo />
      <Partners />
      <Contact />
    </>
  );
}
