interface Window {
  electronAPI: {
    startNpmUpgradeLatest: (
      { packageName: string, repositoryPath: string, repositoryName: string },
      callback: (event: {
        type: "start" | "message" | "done";
        message: string;
        progress: number;
        branchName: string;
      }) => void
    ) => void;
  };
}
declare let window: Window;
