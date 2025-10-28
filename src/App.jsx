import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchBooks = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${query}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      const data = await response.json()
      setBooks(data.docs)
    } catch (err) {
      setError(err.message)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchBooks()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-start justify-center pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-8 md:mb-16 mt-8 md:mt-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-blue-600 mb-2 md:mb-4 animate-bounce">
            Book Finder
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-semibold mb-4 md:mb-6">
            Discover your next great read
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className=" my-3 flex flex-col md:flex-row gap-4 items-center justify-center">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter book title..."
              className="w-full md:w-96 px-6 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all duration-300 shadow-sm"
            />
            <button
              onClick={searchBooks}
              disabled={loading}
              className=" w-30 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center">
          {loading && (
            <div className="flex items-center gap-3 text-gray-600 mb-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Loading amazing books...</span>
            </div>
          )}

          {!loading && books.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {books.slice(0, 20).map((book, index) => (
                <div
                  key={book.key || index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                    {book.cover_i ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                        alt={`${book.title} cover`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/vite.svg'
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 text-sm font-medium">No Cover</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Author:</span> {book.author_name ? book.author_name.join(', ') : 'Unknown'}
                    </p>
                    {book.first_publish_year && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Published:</span> {book.first_publish_year}
                      </p>
                    )}
                    {book.publisher && book.publisher[0] && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Publisher:</span> {book.publisher[0]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && books.length === 0 && query && !error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
              <p className="text-gray-500">Try searching for a different title</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
