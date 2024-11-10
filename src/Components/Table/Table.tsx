type Props = {
    config: Array<any>;
    data: Array<any>;
    onRowClick: (id: string) => void;
  };
  
  const Table = ({ config, data, onRowClick }: Props) => {
    const renderedRows = data.map((rowItem: any) => {
      const keyField = config.find((col: any) => col.keyField)?.keyField || 'id';
      
      return (
        <tr
          key={rowItem[keyField]}
          className="hover:bg-blue-50 transition-colors duration-200 ease-in-out"
          onClick={() => onRowClick(rowItem[keyField])}
        >
          {config.map((val: any, index: number) => {
            return (
              <td key={index} className="p-4 text-sm text-gray-700">
                {val.render(rowItem)}
              </td>
            );
          })}
        </tr>
      );
    });
  
    const renderedHeaders = (
      <tr>
        {config.map((config: any) => {
          return (
            <th
              key={config.label}
              className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider bg-blue-100"
            >
              {config.label}
            </th>
          );
        })}
      </tr>
    );
  
    return (
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 overflow-x-auto px-4">
        <table className="min-w-full divide-y divide-gray-200 m-5 max-w-full">
          <thead className="bg-gray-50">
            {renderedHeaders}
          </thead>
          <tbody>{renderedRows}</tbody>
        </table>
      </div>
    );
  };
  
  export default Table;
  