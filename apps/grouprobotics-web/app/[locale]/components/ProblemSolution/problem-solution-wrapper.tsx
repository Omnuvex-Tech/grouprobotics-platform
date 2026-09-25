import { ProblemSolution as ProblemSolutionUI } from '@repo/ui';
import { getProblemSolution } from '@/lib/api';

const FALLBACK_IMAGE = '/images/solution.jpg';

export async function ProblemSolution({ locale }: { locale: string }) {
  const data = await getProblemSolution();
  const lang = (locale in data.headline ? locale : 'az') as keyof typeof data.headline;

  return (
    <ProblemSolutionUI
      badge={data.badge[lang]}
      title={data.headline[lang]}
      description={data.description[lang]}
      image={data.backgroundImage || FALLBACK_IMAGE}
      imageAlt={data.headline[lang]}
    />
  );
}