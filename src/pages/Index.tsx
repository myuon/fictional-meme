import * as React from "react";
import { useIssues } from "../api/issue";
import { useAuthUser } from "../api/user";

export const IndexPage = () => {
  const { data: user } = useAuthUser();
  const { data: issues } = useIssues();

  return (
    <div>
      <h2>Hi, {user?.name}!</h2>

      {issues?.map((issue) => (
        <div key={issue.id}>
          <h3>{issue.title}</h3>
          <span>{issue.updated_at}</span>,<span>{issue.created_at}</span>
        </div>
      ))}
    </div>
  );
};

export default IndexPage;
