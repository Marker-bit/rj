const repositoryUrl = "https://github.com/Marker-bit/rj";

// Railway exposes the deployed commit as RAILWAY_GIT_COMMIT_SHA at both build
// and run time, so it is read at runtime and does not depend on a build arg.
// COMMIT_SHA/GITHUB_SHA cover CI and manual builds; NEXT_PUBLIC_COMMIT_SHA is
// kept for compatibility, but Next inlines it at build time.
const commit =
  process.env.COMMIT_SHA ||
  process.env.RAILWAY_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.NEXT_PUBLIC_COMMIT_SHA ||
  null;

export function getBuildInfo() {
  const isProduction = process.env.NODE_ENV === "production";
  const shortCommit = commit?.slice(0, 7);
  const url =
    isProduction && commit ? `${repositoryUrl}/commit/${commit}` : null;

  return {
    label: isProduction && shortCommit ? shortCommit : "dev",
    url,
  };
}
