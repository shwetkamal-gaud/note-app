import React from 'react'
import ReactDOM from "react-dom";
import { X } from 'lucide-react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

type ModalProps = {
    onClose: () => void;
    note: { title: string, content?: string }
    setNote: React.Dispatch<React.SetStateAction<{ title: string, content?: string }>>
    isEdit: boolean
    onCreate: () => void;
    onUpdate: () => void;
};


const Modal: React.FC<ModalProps> = ({  onClose, note, isEdit, setNote, onCreate, onUpdate }) => {
    const handleSubmit = () => {
        if (!note.title.trim()) return; 
        isEdit ? onUpdate() : onCreate();
        onClose();
    }
    return ReactDOM.createPortal(
        <div className="fixed  inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
            <div className="w-200 bg-white rounded-lg shadow-lg ">
                <div className="border-b p-4 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">{isEdit ? "Edit Note" : 'Add NOte'}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X />
                    </button>
                </div>
                <div className="p-4">
                    <input
                        required
                        type="text"
                        placeholder="Note title"
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        value={note.title}
                        onChange={(e) => { setNote((prev) => ({ ...prev, title: e.target.value })) }}
                    />

                    <SimpleMDE
                        value={note.content || ""}
                        onChange={(value) => setNote((prev) => ({ ...prev, content: value }))}
                    />
                </div>
                <div className="flex justify-end gap-4 mb-2 me-2">
                    <button
                        className="py-2 px-4 rounded-lg bg-gray-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="py-2 px-4 rounded-lg bg-blue-500 text-white"
                        onClick={handleSubmit}
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}

export default Modal