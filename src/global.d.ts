interface Window {
  electronAPI: {
    npmUpgradeLatest: ({
      packageName: string,
      repositoryPath: string,
      repositoryName: string,
    }) => Promise<string | undefined>;
  };
}
declare let window: Window;
