import React, { useState } from 'react';
import './Dashboard.css';
import useLocalStorage from './useLocalStorage';
import useWindowsSize from './useWindowsSize';
import useToggle from './useToggle';
import useFetch from './useFetch';
import useDebounce from './useDebounce';

function Dashboard() {
    const [userPrefs, setUserPrefs] = useLocalStorage('dashboard-prefs', 
        { theme: 'light', language: 'ro', itemsPerPage: 10 });
        const {
            data: posts,
            loading,
            error,
        } = useFetch('https://jsonplaceholder.typicode.com/posts');
    console.log('posts:', posts, 'loading:', loading, 'error:', error);
        const [searchQuery, setSearchQuery] = useState('');
        const debouncedSearchQuery = useDebounce(searchQuery, 500);
        const { width, isMobile, isTablet, isDesktop } = useWindowsSize();
        const [showSidebar, sidebarControls]= useToggle(false);
        // sincronizează showSidebar cu isMobile la schimbare
        React.useEffect(() => {
            if (isMobile) {
                sidebarControls.setFalse();
            } else {
                sidebarControls.setTrue();
            }
        }, [isMobile]);
        const [showFilters, filtersControls]= useToggle(false);
        const [compactView, compactViewControls]= useToggle(false);
        const filteredPosts = posts ? posts.filter(post =>{
            if(!debouncedSearchQuery) return true;
            return post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            post.body.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        }) : [];
        const [currentPage, setCurrentPage]= useState(1);
        const itemsPerPage = userPrefs.itemsPerPage;
        const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
        const paginatedPosts = filteredPosts.slice((currentPage - 1)
         * itemsPerPage, currentPage * itemsPerPage);
        const handleThemeChange= () => {
            setUserPrefs(prev => ({
                ...prev,
                theme: prev.theme === 'light' ? 'dark' : 'light'
            }));
        }
        const handleItemsPerPageChange=(value)=>{
            setUserPrefs(prev => ({
                ...prev,
                itemsPerPage: value
            }));
            setCurrentPage(1);
        }

  return(
    <div style={{
        backgroundColor: userPrefs.theme === 'dark' ? '#333' : '#fff',
        color: userPrefs.theme === 'dark' ? '#fff' : '#000',
        display: 'flex',
        minHeight: '100vh'
    }}>
        {showSidebar && (
            <aside style={{
                width: isMobile ? '100%' : '250px',
                backgroundColor: userPrefs.theme === 'dark' ? '#444' : '#f9f9f9',
                padding: '20px',
                borderRight: '2px solid #ddd',
            }}>
                <h3>Dashboard</h3>
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={handleThemeChange}>
                        {userPrefs.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        {userPrefs.theme === 'light' ? '🌙' : '☀️'}
                    </button>

                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={compactView}
                            onChange={compactViewControls.toggle}
                        />
                        Compact View
                    </label>
                </div>
                    
                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Items per page:
                        <select
                            value={itemsPerPage}
                            onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </label>
                </div>
                <div style={{
                    padding:'10px 0',
                    backgroundColor: userPrefs.theme === 'dark' ? '#555' : '#e9e9e9',
                    borderRadius:'5px'
                }}>
                    <p>Latime ecran: {width}px | {isMobile ? 'Mobil' : isTablet ? 'Tableta' : 'Desktop'}</p>
                </div>
                {isMobile && (
                    <button onClick={sidebarControls.toggle} style={{ marginTop: '20px' }}>
                        Close Sidebar
                    </button>
                )}
            </aside>
        )}
            <main style={{ flex: 1, padding: '20px' }}>
                <header style={{ marginBottom: '20px', display: 'flex', 
                    justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Dashboard</h1>
                    <button onClick={() => window.location.reload()}>Refresh</button>
                </header>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '16px', maxWidth: '400px',

                         backgroundColor: userPrefs.theme === 'dark' ? '#555' : '#f0f0f0',
                         border: '1px solid #ccc', borderRadius: '5px',
                         color: userPrefs.theme === 'dark' ? '#fff' : '#000'
                     }}

                    />
                    {searchQuery && searchQuery !== debouncedSearchQuery && (
                        <p style={{fontSize: '12px', marginTop: '5px'}}>
                            Cautare dupa ce termini de tastat</p>
                    )}

                </div>
                <button onClick={filtersControls.toggle} style={{ marginBottom: '20px' }}>
                    {filtersControls.isOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
                {showFilters && (
                    <div style={{
                        marginTop: '10px',
                        marginBottom: '20px',
                        padding: '10px',
                        backgroundColor: userPrefs.theme === 'dark' ? '#555' : '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}>
                        <p>Filter options go here</p>
                    </div>
                )}
                <div>
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{fontSize:'40px'}}></div>
                            <p>Loading posts...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'red',
                            backgroundColor: userPrefs.theme === 'dark' ? '#660000' : '#ffdddd',
                            borderRadius: '5px'
                         }}>
                            <p>Error loading posts: {error.message}</p>
                            <button onClick={() => window.location.reload()}>Retry</button>
                        </div>
                    )}
                    {!loading && !error &&(
                        <>
                        <div style={{marginBottom: '20px'}}>
                            <p>
                                Showing {paginatedPosts.length} of {filteredPosts.length} results
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>

                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: compactView ? '1fr 1fr 1fr' : '1fr 1fr',
                            gap: '20px'
                        }}>
                            {paginatedPosts.map(post => (
                                <div key={post.id} style={{
                                    padding: '10px',
                                    backgroundColor: userPrefs.theme === 'dark' ? '#444' : '#fff',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                }}>
                                    <h3 
                                    style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '10px'}}>
                                        #{post.id} {post.title}
                                    </h3>
                                    {!compactView && (
                                        <p style={{
                                            fontSize: '14px',
                                            opacity: 0.8,
                                        }}>{post.body.substring(0, 100)}...</p>
                                    )}
                                    
                                </div>
                            ))}
                        </div>
                        {totalPages>1 && (
                            <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex',
                                justifyContent: 'center', gap: '10px', flexWrap: 'wrap'
                            }}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                        </>
                    )}
                    
                </div>
                <footer style={{ marginTop: '40px', textAlign: 'center', padding: '20px',
                    borderTop:`1px solid ${userPrefs.theme === 'dark' ? '#555' : '#ddd'}`
                }}>
                    <p>Custom Hooks Activi: useLocalStorage, useFetch, useDebounce,useWindowsSize,
                        useToggle </p>
                    <p style={{ fontStyle: 'italic', opacity: 0.8, fontSize: '14px', marginTop: '10px' }}>
                        Preferințele tale sunt salvate automat în browser</p>
                </footer>
            </main>
        </div>
    )
}

export default Dashboard;