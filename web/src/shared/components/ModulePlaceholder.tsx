import { PageHeader } from '@/shared/components/PageHeader'

type ModulePlaceholderProps = {
  title: string
  description: string
}

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Module shell ready — implement screens in this feature folder.
      </div>
    </div>
  )
}
