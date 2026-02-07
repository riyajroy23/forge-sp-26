import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";


export default function UserSetup() {
  return (


    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="flex items-center gap-4">
            <button
              className="w-16 h-16 rounded-full bg-gray-300 hover:bg-gray-400 transition"
            />

            <div>
              <p className="text-lg font-semibold">username</p>
            </div>
          </div>

          <div className="mt-4">
  <p className="text-sm text-gray-600">
    This is the user’s bio. It can be edited later.
  </p>
</div>

        </CardContent>
      </Card>


    </div>
  );
}
