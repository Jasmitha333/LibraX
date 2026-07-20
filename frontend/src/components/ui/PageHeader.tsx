type PageHeaderProps = {
  title: string;
  subtitle: string;
  button?: React.ReactNode;
};

function PageHeader({
  title,
  subtitle,
  button,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm text-slate-500">
          {subtitle}
        </p>

        <h1 className="text-3xl font-semibold text-slate-900 mt-1">
          {title}
        </h1>
      </div>

      {button}
    </div>
  );
}

export default PageHeader;