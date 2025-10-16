import { AddGroupButton } from "@/app/(app)/(groups)/groups/add-group-button";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { UsersIcon } from "lucide-react";

export const GroupsEmpty = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <UsersIcon />
      </EmptyMedia>
      <EmptyTitle>Вы не состоите ни в одной группе</EmptyTitle>
      <EmptyDescription>
        Присоединяйтесь к группам или создавайте их.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <AddGroupButton />
    </EmptyContent>
  </Empty>
);
