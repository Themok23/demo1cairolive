import { PersonRepository } from '../../../domain/repositories/personRepository';
import { ArticleRepository } from '../../../domain/repositories/articleRepository';
import { SubmissionRepository } from '../../../domain/repositories/submissionRepository';
import { SubscriberRepository } from '../../../domain/repositories/subscriberRepository';
import { Submission } from '../../../domain/entities/submission';

export interface DashboardStatsResult {
  success: boolean;
  data?: {
    totalPeople: number;
    totalArticles: number;
    pendingSubmissions: number;
    activeSubscribers: number;
    recentSubmissions: Submission[];
  };
  error?: string;
}

export class GetDashboardStatsUseCase {
  constructor(
    private personRepository: PersonRepository,
    private articleRepository: ArticleRepository,
    private submissionRepository: SubmissionRepository,
    private subscriberRepository: SubscriberRepository
  ) {}

  async execute(): Promise<DashboardStatsResult> {
    try {
      const [
        personResult,
        articleResult,
        pendingSubmissionsCount,
        activeSubscribersCount,
        recentSubmissions,
      ] = await Promise.all([
        this.personRepository.findAll({ limit: 1, offset: 0 }),
        this.articleRepository.findAll({ limit: 1, offset: 0 }),
        this.submissionRepository.countByStatus('pending'),
        this.subscriberRepository.countActive(),
        this.submissionRepository.findPending(),
      ]);

      const totalPeople = personResult.total;
      const totalArticles = articleResult.total;

      const limitedRecentSubmissions = recentSubmissions.slice(0, 5);

      return {
        success: true,
        data: {
          totalPeople,
          totalArticles,
          pendingSubmissions: pendingSubmissionsCount,
          activeSubscribers: activeSubscribersCount,
          recentSubmissions: limitedRecentSubmissions,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
