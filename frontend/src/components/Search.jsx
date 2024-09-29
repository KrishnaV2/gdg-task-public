import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

export default function Search({ filterChange }) {
    return (
        <div className='flex flex-row text-black flex-wrap justify-center bg-slate-900'>
            <input onChange={filterChange} className="md:w-2/3" type="text" placeholder="Search Movie" />
            <AddMovieModal />
        </div>
    )
}

function AddMovieModal() {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [formData, setFormData] = useState({
        title: '',
        genres: [],
        date: '',
        rating: '',
        description: '',
        url: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleGenreChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevData => {
            if (checked) {
                return { ...prevData, genres: [...prevData.genres, value] };
            } else {
                return { ...prevData, genres: prevData.genres.filter(genre => genre !== value) };
            }
        });
    };

    const handleSave = async () => {
        try {
            const date = formData.date.split("-");
            // console.log(new Date(1 * date[0], (1 * date[1]) - 1, 1 * date[2]))
            formData.releaseDate = new Date(1 * date[0], (1 * date[1]) - 1, 1 * date[2])
            formData.genre = formData.genres;
            formData.posterUrl = formData.url;
            formData.date = undefined
            formData.url = undefined
            const response = await fetch('/api/v1/movie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json()
            if (data.status === "success") {
                alert('Data saved successfully!');
                handleClose()
            } else {
                alert('Failed to save data. Please try again.');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('An error occurred while saving data.');
        }
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const genres = ['Action', 'Drama', 'Horror', 'Thriller', 'History', 'Mystery', 'Adventure', 'Sci-Fi'];

    return (
        <div>
            <Button className='bg-green-400 text-black font-medium' onClick={handleOpen}>Add Movie</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='bg-slate-800 text-white max-w-md mx-auto mt-8 p-6 text-white rounded-lg shadow-md' sx={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Add Movie</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-white">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="text-black mt-1 w-[15rem]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="genre" className="block text-sm font-medium">Genre</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {genres.map((genre) => (
                                            <label key={genre} style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    name="genres"
                                                    value={genre}
                                                    checked={formData.genres.includes(genre)}
                                                    onChange={handleGenreChange}
                                                    className='text-black'
                                                    style={{ marginRight: '5px' }}
                                                />
                                                {genre}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-white">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="text-black mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-white">Rating</label>
                                    <input
                                        type="number"
                                        id="rating"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        className="text-black mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="text-black mt-1 w-[20rem]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium text-white">URL</label>
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleInputChange}
                                        className="text-black mt-1 w-[20rem]"
                                    />
                                </div>

                                <Button onClick={handleSave} className="w-full">Save</Button>
                            </div>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}