import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash, Tag, Plus, ArrowLeft } from 'lucide-react';

// Initial demo notes
const initialNotes = [
  {
    id: 1,
    title: 'React Hooks Overview',
    content: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and allow you to use state and other React features without writing a class component.',
    labels: ['React', 'Frontend', 'Programming'],
    createdAt: new Date('2025-05-01T10:30:00'),
    updatedAt: new Date('2025-05-01T10:30:00')
  },
  {
    id: 2,
    title: 'CSS Grid Layout Tips',
    content: 'CSS Grid Layout is a two-dimensional grid-based layout system aimed at web page design. It allows for the creation of complex responsive web design layouts more easily and consistently across browsers. Some key properties: grid-template-columns, grid-template-rows, grid-gap, etc.',
    labels: ['CSS', 'Frontend', 'Design'],
    createdAt: new Date('2025-05-02T15:45:00'),
    updatedAt: new Date('2025-05-02T15:45:00')
  },
  {
    id: 3,
    title: 'JavaScript Promises',
    content: 'Promises in JavaScript represent operations that haven\'t completed yet, but are expected to complete in the future. They are used to handle asynchronous operations. A Promise can be in one of three states: pending, fulfilled, or rejected.',
    labels: ['JavaScript', 'Programming', 'Async'],
    createdAt: new Date('2025-05-03T09:15:00'),
    updatedAt: new Date('2025-05-03T09:15:00')
  }
];

// Main application component
export default function KnowledgeManagementTool() {
  // State management
  const [notes, setNotes] = useState(() => {
    // Load notes from localStorage or use initial demo notes
    const savedNotes = localStorage.getItem('knowledgeNotes');
    return savedNotes ? JSON.parse(savedNotes) : initialNotes;
  });
  
  const [currentView, setCurrentView] = useState('home'); // 'home', 'create', 'view', 'edit'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentNote, setCurrentNote] = useState(null);
  const [availableLabels, setAvailableLabels] = useState([]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('knowledgeNotes', JSON.stringify(notes));
    
    // Extract all unique labels
    const labels = new Set();
    notes.forEach(note => note.labels.forEach(label => labels.add(label)));
    setAvailableLabels(Array.from(labels));
  }, [notes]);

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.labels.some(label => label.toLowerCase().includes(query))
    );
  });

  // Sort notes by recency (latest first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // Create a new note
  const createNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([...notes, newNote]);
    setCurrentView('home');
  };

  // Update an existing note
  const updateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date() } 
        : note
    ));
    setCurrentView('view');
    setCurrentNote(updatedNote);
  };

  // Delete a note
  const deleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
      setCurrentView('home');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render different views based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Knowledge Notes</h1>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                onClick={() => {
                  setCurrentNote(null);
                  setCurrentView('create');
                }}
              >
                <Plus size={18} />
                <span>New Note</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search notes by title, content or labels..."
                className="w-full p-3 pl-10 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>

            {availableLabels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableLabels.map(label => (
                  <button
                    key={label}
                    className={`px-3 py-1 rounded-full text-sm ${
                      searchQuery === label 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setSearchQuery(label)}
                  >
                    {label}
                  </button>
                ))}
                {searchQuery && (
                  <button
                    className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            <div className="space-y-4">
              {sortedNotes.length > 0 ? (
                sortedNotes.map(note => (
                  <div 
                    key={note.id}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      setCurrentNote(note);
                      setCurrentView('view');
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold">{note.title}</h2>
                      <div className="text-sm text-gray-500">
                        {formatDate(note.updatedAt)}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">{note.content}</p>
                    {note.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {note.labels.map(label => (
                          <span key={label} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery 
                    ? 'No notes match your search criteria' 
                    : 'No notes yet. Create your first note!'}
                </div>
              )}
            </div>
          </div>
        );
        
      case 'create':
      case 'edit':
        return <NoteForm 
          note={currentView === 'edit' ? currentNote : null} 
          onSave={currentView === 'edit' ? updateNote : createNote}
          onCancel={() => {
            setCurrentView(currentView === 'edit' ? 'view' : 'home');
          }}
          availableLabels={availableLabels}
        />;
        
      case 'view':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setCurrentView('home')}
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold flex-grow">{currentNote.title}</h1>
              <div className="flex space-x-2">
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setCurrentView('edit')}
                >
                  <Edit size={20} />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-red-600"
                  onClick={() => deleteNote(currentNote.id)}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md text-sm">
              <div>Created: {formatDate(currentNote.createdAt)}</div>
              <div>Updated: {formatDate(currentNote.updatedAt)}</div>
            </div>
            
            {currentNote.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentNote.labels.map(label => (
                  <span key={label} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {label}
                  </span>
                ))}
              </div>
            )}
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{currentNote.content}</p>
            </div>
          </div>
        );
        
      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderView()}
    </div>
  );
}

// Note form component for creating and editing notes
function NoteForm({ note, onSave, onCancel, availableLabels }) {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [labels, setLabels] = useState(note ? note.labels : []);
  const [newLabel, setNewLabel] = useState('');
  
  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    onSave({
      id: note ? note.id : null,
      title: title.trim(),
      content: content.trim(),
      labels,
      createdAt: note ? note.createdAt : null
    });
  };
  
  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };
  
  const removeLabel = (labelToRemove) => {
    setLabels(labels.filter(label => label !== labelToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={onCancel}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          {note ? 'Edit Note' : 'Create New Note'}
        </h1>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-3 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            className="w-full p-3 border rounded-md min-h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            rows={10}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Labels
          </label>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full p-3 pl-10 border rounded-md"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add a label"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLabel();
                  }
                }}
              />
              <Tag className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <button
              className="bg-blue-600 text-white p-3 rounded-md"
              onClick={addLabel}
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {labels.map(label => (
              <div key={label} className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1">
                <span>{label}</span>
                <button
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => removeLabel(label)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 border rounded-md"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}
