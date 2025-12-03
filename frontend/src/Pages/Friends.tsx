import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../Context/ThemeContext";
import axios from "axios";

interface Friend {
    id: string;
    name: string;
    email: string;
}

const Friends = () => {
    const { isDark, toggleTheme } = useTheme();
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8640/users')
            .then(response => {
                setFriends(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching friends!', error);
            });
    }, []);

    // Add friends from backend on component mount
    const addFriends = () => {
        axios.post('http://localhost:4000/users', {
            name: 'New Friend',
            email: 'newfriend@example.com',
            password: 'password123'
        })
        .then(() => {
            // Refetch the friends list after adding
            axios.get('http://localhost:4000/users')
                .then(response => {
                    setFriends(response.data);
                });
        })
        .catch(error => {
            console.error('There was an error adding a new friend!', error);
        });
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={addFriends}>
                Add Friend
            </Button>
            <Typography variant="h4" gutterBottom>
                Friends List
                <Button onClick={toggleTheme} sx={{ mt: 2, ml: 2 }}>
                    {isDark ? <Sun /> : <Moon />}
                </Button>
            </Typography>
            {/* Render the friends list */}
            <ul>
                {friends.map((friend) => (
                    <li key={friend.id}>{friend.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Friends;