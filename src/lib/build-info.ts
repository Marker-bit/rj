const repositoryUrl = "https://tgit.markerbit.dev/markerbit/rj";

const commit =
  process.env.NEXT_PUBLIC_COMMIT_SHA ||
  process.env.COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  null;

export function getBuildInfo() {
  const isProduction = process.env.NODE_ENV === "production";
  const shortCommit = commit?.slice(0, 7);
  const url = isProduction && commit ? `${repositoryUrl}/commit/${commit}` : null;

  return {
    label: isProduction && shortCommit ? shortCommit : "dev",
    url,
  };
}
