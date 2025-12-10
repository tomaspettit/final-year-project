import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AppBarComponent from "../Components/AppBarComponent";

interface Friend {
    id: string;
    name: string;
    email: string;
}

const Friends = () => {
    const [friends, setFriends] = useState<Friend[]>([]);

    const reloadData = async () => {
        const response = await fetch(`/users`);
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`API error ${response.status}: ${body}`);
        }
        const data = await response.json();
        // Map _id to id for all friends
        const mapped = data.map((friend: any) => ({
            id: friend.id || friend._id,
            name: friend.name,
            email: friend.email
        }));
        setFriends(mapped);
    }

    useEffect(() => {
        reloadData();
    }, []);

    const createFriend = async (friend: { name: string; email: string; password: string; }): Promise<Friend> => {
        const response = await fetch(`/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(friend),
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`API error ${response.status}: ${body}`);
        }
        const data = await response.json();
        // Map _id to id for frontend use
        const mapped = {
            id: data.id || data._id,
            name: data.name,
            email: data.email
        };
        setFriends(prev => [...prev, mapped]);
        return mapped;
    }

    const deleteFriend = async (id: string): Promise<void> => {
        const response = await fetch(`/user/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`API error ${response.status}: ${body}`);
        }
        await reloadData();
    }

    return (
        <div>
            <AppBarComponent title="Friends" isBackButton={false} isSettings={true}  isExit={true}/>
            <Button variant="contained" color="primary" onClick={() => createFriend({ name: "New Friend", email: "friend@example.com", password: "password" })}>
                Add Friend
            </Button>
            <Typography variant="h4" gutterBottom>
                Friends List
            </Typography>
            {/* Render the friends list */}
            <ul>
                {friends.map((friend, idx) => {
                    if (!friend.id) {
                        console.warn('Friend missing id:', friend);
                        return (
                            <li key={`friend-missing-id-${idx}`}>{friend.name} <span style={{color: 'red'}}>Missing ID - cannot delete</span></li>
                        );
                    }
                    return (
                        <li key={friend.id}>{friend.name} <Button onClick={() => deleteFriend(friend.id)}>Delete</Button></li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Friends;