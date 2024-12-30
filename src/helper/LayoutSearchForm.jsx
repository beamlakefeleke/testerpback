import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LayoutSearchForm = ({ openModalFun, value }) => {
  const links = [
    { key: 1, link: '/asset/store', name: 'asset' ,desc:'Manage Assets'},
    { key: 1, link: '/asset/transaction', name: 'asset' ,desc:'Asset Transaction'},
    { key: 1, link: '/asset/maintenance', name: 'asset' ,desc:'Asset Maintenance'},
    { key: 2, link: '/vacancy', name: 'vacancy' },
    { key: 3, link: '/dashboard', name: 'dashboard' },
    { key: 4, link: '/payroll', name: 'payroll' },
    { key: 5, link: '/attendance', name: 'attendance' },
  ];

  const [searchLinks, setSearchedLinks] = useState([]);

  useEffect(() => {
    if (value) {
      const filteredLinks = links.filter((l) => l.name.includes(value.toLowerCase()));
      setSearchedLinks(filteredLinks);
    } else {
      setSearchedLinks([]); // Reset when there's no search value
    }
  }, [value]);

  return (
    <div>
      {searchLinks.length > 0 ? (
        searchLinks.map((link) => (
          <Card>
            <Link onClick={()=>openModalFun(false)} to={link.link} key={link.key}>
            <span href={link.link}>{link.name}</span>
            <span href={link.link}>{link.desc}</span>
          </Link>
          </Card>
        ))
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
};

export default LayoutSearchForm;
