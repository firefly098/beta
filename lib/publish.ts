import { PublishStatus } from "@prisma/client";

/**
 * Shared publish visibility filter.
 * Cast at use-sites via spread — kept untyped so it works across Page/Casino/Bookmaker/Bonus models.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const publishedWhere: any = {
  OR: [
    { status: PublishStatus.PUBLISHED },
    {
      status: PublishStatus.SCHEDULED,
      scheduledAt: { lte: new Date() },
    },
  ],
};

export function isPubliclyVisible(status: PublishStatus, scheduledAt?: Date | null) {
  if (status === PublishStatus.PUBLISHED) return true;
  if (status === PublishStatus.SCHEDULED && scheduledAt && scheduledAt <= new Date()) return true;
  return false;
}
