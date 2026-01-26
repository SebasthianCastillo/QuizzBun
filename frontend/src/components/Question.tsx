import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/components/ui/button";
import type { Questions } from "../../types";
import { cn } from "@/lib/utils";

export default function Question({ info }: { info: Questions }) {
  const handleOptionClick = (id: string, index: number) => {
    console.log(id, index);
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-pretty leading-relaxed">
          {info.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {info.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleOptionClick(option, index)}
            variant="outline"
            className={cn("w-full justify-start text-left h-auto py-3 px-4")}
          >
            <span className="font-medium mr-3">
              {String.fromCharCode(65 + index)}.
            </span>

            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
