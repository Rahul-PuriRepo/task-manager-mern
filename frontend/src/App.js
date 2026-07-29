import "./App.css";
import { useEffect, useState } from "react";
import {
  getAllTasks,
  deleteTask,
  patchTask,
  API_BASE_URL,
} from "./services/task.service";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
    Button,
    Typography,
    Container,
    Box,
    Stack,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddTaskDialog from "./components/AddTaskDialog";
import DownloadIcon from "@mui/icons-material/Download";

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
  getAllTasks()
    .then((response) => {
      setTasks(response.data.data || []);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);

  console.log(tasks);

  const handleMarkAsDone = async (id) => {
    try {

        // Your code here
        const response = await patchTask(id);
        const updatedTask = response.data.data;
        setTasks(previousTasks =>
    previousTasks.map(task => {

        if (task._id === updatedTask._id) {

            return updatedTask;

        }

        return task;

    })
  );

    } catch (error) {
        console.error(error);
    }
};

const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setOpen(true);
};

  const handleDelete = async (id) => {
  try {
    await deleteTask(id);

    setTasks(previousTasks =>
    previousTasks.filter(task =>
        task._id !== id
    )
);

  } catch (error) {
    console.error(error);
  }
};

const handleTaskUpdated = (updatedTask) => {

    setTasks(previousTasks =>
        previousTasks.map(task =>
            task._id === updatedTask._id
                ? updatedTask
                : task
        )
    );

};

const getTaskDisplayStatus = (task) => {
  const today = new Date();
  const deadline = new Date(task.deadline);

  if (today <= deadline) {
    return "In Progress";
  }

  if (task.status === "DONE") {
    return "Achieved";
  }

  return "Failed";
};


const handleOpen = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
};

const handleTaskCreated = (newTask) => {

    setTasks(previousTasks => [

        ...previousTasks,

        newTask

    ]);

};


  return (
    <Container maxWidth="lg">

    <Box sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
      Task Manager
      </Typography>
      <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={handleOpen}
    sx={{
        mb:3
    }}
>
    Add Task
</Button>
<AddTaskDialog
    open={open}
    handleClose={handleClose}
    onTaskCreated={handleTaskCreated}
    onTaskUpdated={handleTaskUpdated}
    task={selectedTask}
    isEditMode={isEditMode}
/>
    {tasks.length === 0 ? (
        <Typography sx={{ mt: 4 }}>
            No Tasks Found
        </Typography>
    ) : (
    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
      <Table>

        <TableHead>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Deadline</strong></TableCell>
            <TableCell><strong>Attachment</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>

      <TableBody>
        {tasks.map((task) => {
          const displayStatus = getTaskDisplayStatus(task);

          return (
          <TableRow key={task._id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>
    <Chip
        label={displayStatus}
        color={
            displayStatus === "Achieved"
                ? "success"
                : displayStatus === "Failed"
                ? "error"
                : "warning"
        }
    />
</TableCell>
      
            <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
            <TableCell>
    {task.linkedFile && (
        <Button
            component="a"
            href={`${API_BASE_URL}/${task.linkedFile}`}
            download
            size="small"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DownloadIcon />}
        >
            PDF
        </Button>
    )}
</TableCell>
           <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
    <Button disabled={task.status === "DONE"}
      onClick={() => handleMarkAsDone(task._id)}>
    {task.status === "DONE"
        ? "Completed"
        : "Mark as Done"}
    </Button>

    <IconButton
        color="error"
        onClick={() => handleDelete(task._id)}
    >
        <DeleteIcon />
    </IconButton>
    <IconButton
    disabled={task.status === "DONE"}
    color="primary"
    onClick={() => handleEdit(task)}
>
    <EditIcon />
</IconButton>
</Stack>

</TableCell>
        </TableRow>
    );

})}
    </TableBody>

    </Table>
  </TableContainer>)}
    </Box>

</Container>
  );
}

export default App;