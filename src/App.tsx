import { useEffect, useState } from 'react'

import './App.css'
import Modal from './Components/Modal'
import { useNoteStore } from './store/useNotes'
import type { Note } from './types'
import { Delete, EditIcon, Grid, List, } from 'lucide-react'
import { toast } from 'react-toastify'
import ReactMarkdown from "react-markdown";


function App() {
  const [isDrop, setIsDrop] = useState(false)
  const [filter, setFilter] = useState('Title')
  const [isModal, setIsModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isList, setIsList] = useState(true)
  const [search, setSearch] = useState('')
  const [currentNote, setCurrentNote] = useState<Note>()
  const [note, setNote] = useState<{ title: string, content?: string }>({ title: '', content: '' })
  const { createNote, updateNote, fetchNotes, notes, syncNote, syncAllNotes, loading, deleteNote } = useNoteStore()
  const [isOnline, setIsOnline] = useState<boolean>()
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes])
  const filteredNotes = notes.filter(note => {
    const fieldValue = note[filter.toLowerCase() as 'title' | 'content']
    return fieldValue?.toLowerCase().includes(search.toLowerCase())
  }
  )
  useEffect(() => {
    setIsOnline(navigator.onLine)
  }, [navigator.onLine])
  useEffect(() => {
    const handleOnline = () => {
      if (notes.some(note => !note.synced)) {
        syncAllNotes();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [notes]);
  return (
    <div className='flex flex-col gap-5 p-3 w-full h-[100%]'>
      <form className="w-full flex justify-between items-center">
        <div className="flex">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input value={search}
              onChange={(e) => setSearch(e.target.value)} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." />
          </div>
          <div className=' flex relative'>
            <button
              onClick={() => setIsDrop((prev) => !prev)}
              className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              type="button"
            >
              {filter}
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {isDrop && <div

              className="z-10 absolute top-15 bg-white divide-y divide-gray-100 rounded-r-lg shadow-sm w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdown-button"
              >
                {['Title', 'Content'].map((item, key) => (

                  <li onClick={() => { setFilter(item); setIsDrop((prev) => !prev) }} key={key}>
                    <button
                      type="button"
                      className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {item}
                    </button>
                  </li>
                ))}

              </ul>
            </div>}
          </div>

        </div>
        <button onClick={() => { setIsModal((prev) => !prev); setIsEdit(false); setNote({ title: '', content: '' }) }} type='button' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Add Note</button>
      </form>
      <div className='flex flex-col'>
        <div className='flex justify-between items-center'>
          <div className='flex justify-between w-full items-center'>
            <div className='flex gap-2 items-center'>

              <h1 className='text-3xl'>Notes</h1>
              <span className={isOnline ? 'bg-green-500 p-1 rounded' : 'bg-red-500 p-1 rounded'}>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className='flex  gap-1 items-center'>

              <button onClick={() => setIsList(true)} className={isList ? 'bg-gray-200 p-2 rounded' : 'p-2 bg-white rounded shadow'}>
                <List />
              </button>
              <button onClick={() => setIsList(false)} className={!isList ? 'bg-gray-200 p-2 rounded' : 'p-2 bg-white rounded shadow'}>
                <Grid />
              </button>
            </div>
          </div>
          {notes.some(n => !n.synced) && (
            <button
              onClick={() => {
                if (isOnline) { syncAllNotes() } else {
                  toast.error('Please Connect to Network')
                }
              }}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
            >
              {loading ? `Syncing` : 'Sync All'}
            </button>
          )}
        </div>
        {isList ?
          <div className='flex flex-col gap-3 bg-white shadow overflow-y-auto max-h-[80vh] p-2 mt-4'>
            <div className='bg-white sticky top-0 z-20 shadow grid grid-cols-4 p-2'>
              <p>Title</p>
              <p>Content</p>
              <p>UpdatedAt</p>
              <p className='text-end pe-2'>Actions</p>

            </div>
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className='p-4 border rounded grid grid-cols-4 p-2 hover:bg-gray-100 '

              >
                <h2 className='text-xl font-bold'>{note.title}</h2>
                <ReactMarkdown>{note.content}</ReactMarkdown>
                <p className='text-xs text-gray-400 mt-1'>Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
                <div className='flex items-center gap-2 justify-end'>
                  <button onClick={() => {
                    setIsEdit(true);
                    setNote({ title: note.title, content: note.content });
                    setCurrentNote(note);
                    setIsModal(true);
                  }}>
                    <EditIcon />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className=''>
                    <Delete />
                  </button>
                  <button
                    disabled={note.synced}
                    onClick={() => {
                      if (isOnline) { syncNote(note) } else {
                        toast.error('Please Connect to network')
                      }
                    }}
                    className={`text-sm px-2 py-1 rounded ${note.synced ? 'bg-green-200 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-white'}`}
                  >
                    {note.synced ? 'Synced' : loading ? 'Syncing' : 'Sync'}
                  </button>
                </div>
              </div>
            ))}
            {filteredNotes.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No notes found.</p>
            )}
          </div> :
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className='p-4 shadow rounded flex justify-between hover:bg-gray-100 cursor-pointer'
                onClick={() => {
                  setIsEdit(true);
                  setNote({ title: note.title, content: note.content });
                  setCurrentNote(note);
                  setIsModal(true);
                }}
              >
                <div className='flex flex-col gap-1'>
                  <h2 className='text-lg font-semibold'>{note.title}</h2>
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                  <p className='text-xs text-gray-400 mt-1'>Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
                </div>
                <div className='flex items-start gap-2 '>
                  <button onClick={() => {
                    setIsEdit(true);
                    setNote({ title: note.title, content: note.content });
                    setCurrentNote(note);
                    setIsModal(true);
                  }}>
                    <EditIcon />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className=''>
                    <Delete />
                  </button>
                  <button
                    disabled={note.synced}
                    onClick={() => {
                      if (navigator.onLine) { syncNote(note) } else {
                        alert('Please Connect to network')
                      }
                    }}
                    className={`text-sm px-2 py-1 rounded ${note.synced ? 'bg-green-200 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-white'}`}
                  >
                    {note.synced ? 'Synced' : loading ? 'Syncing' : 'Sync'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
      {isModal && <Modal onClose={() => setIsModal((prev) => !prev)} isOpen={isModal} isEdit={isEdit} note={note} setNote={setNote} onCreate={() => createNote(note)} onUpdate={() => currentNote && updateNote({ ...note, id: currentNote.id })} />}
    </div>
  )
}

export default App
