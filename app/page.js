'use client'
import { useEffect, useState } from "react";

const url = `${process.env.NEXT_PUBLIC_API_URL}/csv-parser`
export default function Home() {
  const [sort, setSort] = useState('created-at')
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  const fetchData = async () => {
    const response = await fetch(`${url}?` + new URLSearchParams({
      sort,
    }).toString())

    if (!response.ok) {
      setError('Failed to fetch data, please try agian later')
    }
    const json = await response.json();
    setData(json.data)
  }

  useEffect(()=> {
    fetchData()
  }, [sort])
  return (
    <div>
      {error && <div>{error}</div>}
      <main>
        <div className="select-wrapper">
          <select onChange={(e)=>setSort(e.target.value)}>
            <option value='created-at'>sort by create at</option>
            <option value='filename-asc'>sort by filename asc</option>
            <option value='filename-dsc'>sort by filename desc</option>
          </select>
        </div>
        <div className="box-wrapper">
          {
            data.map((item, index)=>{
              return (
                <div key={index} className="box-item">
                  <span className="date">{item.created_at}</span>
                  <span className="name">{item.filename}</span>
                </div>
              )
            })
          }
        </div>
      </main>
      <footer>
        Designed and developed by 
        <a
          href="https://www.linkedin.com/in/umersurkhail/"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;Umer Surkhail
        </a>
      </footer>
    </div>
  );
}
