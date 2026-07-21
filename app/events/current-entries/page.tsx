import Table from "@/components/Table";
import { columns, data } from "@/lib/sampleTableData";

export default function CurrentEntriesPage() {
  return (
    <main className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Current Entries
      </h1>
      <Table columns={columns} data={data} />
    </main>
  );
}