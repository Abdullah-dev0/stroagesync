import { FolderPageClient } from "@/components/features/folder/folder-page-client"

type FolderPageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: FolderPageProps) {
  const { id } = await params

  return <FolderPageClient folderId={id} />
}
