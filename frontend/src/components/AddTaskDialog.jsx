
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { createTask, updateTask } from "../services/task.service";

function AddTaskDialog({ open, handleClose, onTaskCreated, onTaskUpdated, task, isEditMode }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [file, setFile] = useState(null);
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [deadlineError, setDeadlineError] = useState("");

    useEffect(() => {

        if (isEditMode && task) {

            setTitle(task.title);
            setDescription(task.description);
            setDeadline(task.deadline.split("T")[0]);

        } else {

            setTitle("");
            setDescription("");
            setDeadline("");
            setFile(null);

        }

    }, [task, isEditMode]);

    const handleSave = async () => {
    try {
        setTitleError("");
        setDescriptionError("");
        setDeadlineError("");

        let hasError = false;

        if (!title.trim()) {
            setTitleError("Title is required");
            hasError = true;
        }

        if (!description.trim()) {
            setDescriptionError("Description is required");
            hasError = true;
        }

        if (!deadline) {
            setDeadlineError("Deadline is required");
            hasError = true;
        }

        if (hasError) return;
        
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("deadline", deadline);
        if (file) {
            formData.append("linkedFile", file);
        }

        

        let response;

        if (isEditMode) {
            response = await updateTask(task._id, formData);
        } else {
            response = await createTask(formData);
        }

        if (isEditMode) {

            onTaskUpdated(response.data.data);

        } else {

            onTaskCreated(response.data.data);

        }

        setTitle("");
        setDescription("");
        setDeadline("");
        setFile(null);

        handleClose();
    } catch (error) {
        console.error(error);
    }
};

    return (

        <Dialog fullWidth maxWidth="sm" 
    open={open}
    onClose={handleClose}
>

    <DialogTitle>
    {isEditMode ? "Edit Task" : "Add New Task"}
</DialogTitle>

    <DialogContent>
        <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            error={Boolean(titleError)}
            helperText={titleError}
            onChange={(event) => {
                setTitle(event.target.value);
                setTitleError("");
            }}
        />
        <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            error={Boolean(descriptionError)}
            helperText={descriptionError}
            onChange={(event) => {
                setDescription(event.target.value);
                setDescriptionError("");
            }}
        />

        <TextField
            label="Deadline"
            type="date"
            fullWidth
            margin="normal"
            value={deadline}
            error={Boolean(deadlineError)}
            helperText={deadlineError}
            onChange={(event) => { setDeadline(event.target.value);
                setDeadlineError("");
            }}
            slotProps={{
                inputLabel: {
                shrink: true,
            },
        }}
        />
<Button
    variant="outlined"
    component="label"
    sx={{ mt: 2 }}
>
    Upload PDF

    <input
        hidden
        type="file"
        accept=".pdf"
        onChange={(event) => {
            setFile(event.target.files[0]);
        }}
    />

</Button>
{file && (
    <p>
        Selected: {file.name}
    </p>
)}

    </DialogContent>

    <DialogActions>

    <Button
        onClick={handleClose}
    >
        Cancel
    </Button>

    <Button
    variant="contained"
    onClick={handleSave}
>
    {isEditMode ? "Update" : "Save"}
</Button>

</DialogActions>

</Dialog>

    );

}

export default AddTaskDialog;