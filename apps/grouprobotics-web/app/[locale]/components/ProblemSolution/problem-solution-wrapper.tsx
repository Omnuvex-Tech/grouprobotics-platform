import { ProblemSolution as ProblemSolutionUI } from '@repo/ui';
import { getDictionary } from '@/lib/i18n';

export function ProblemSolution({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  return (
    <ProblemSolutionUI
      badge={t.problemSolution.badge}
      titleLineOne={t.problemSolution.titleLineOne}
      titleLineTwo={t.problemSolution.titleLineTwo}
      description={t.problemSolution.description}
      image="/images/solution.jpg"
      imageAlt={t.problemSolution.titleLineOne}
    />
  );
}