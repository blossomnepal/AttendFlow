import { useParams } from 'react-router-dom';

function EmployeeDetail() {
  const { id } = useParams();

  return (
    <div className="p-6 min-h-screen bg-[#f3f4f6]">
      <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">
        Employee Detail (ID: {id})
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <p className="text-[#1a1a1a]">Full attendance history will show here.</p>
      </div>
    </div>
  );
}

export default EmployeeDetail;