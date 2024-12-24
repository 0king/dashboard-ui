import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import axios from "axios";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'

import { Level, Subject, Topic } from "@/models/models";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SyntheticEvent, useState } from "react";
import imageCompression from 'browser-image-compression';
import { useCompressedImage } from "../compress-image";

const baseUrl = "http://localhost:3000";

export default function Home() {

    const queryClient = useQueryClient();

    async function getLevels() {
        const res = await axios.get(`${baseUrl}/levels`);
        return res.data as Level[];
    }

    async function postLevel(level: Level) {
        const res = await axios.post(`${baseUrl}/levels`, level);
        return res.data as Level;
    }

    
    async function getSubjects(levelId: number) {
        const res = await axios.get(`${baseUrl}/subjects?level=${levelId}`);
        return res.data as Subject[];
    }

    async function postSubject(subject: Subject) {
        const res = await axios.post(`${baseUrl}/subjects`, subject);
        return res.data as Subject;
    }

    async function getTopics() {
        const data = {
            subject: "id"
        };
        const res = await axios.get(`${baseUrl}/topics`, { params: data});
        return res.data as Topic[];
    }

    const { data, isLoading, error } = useQuery({ queryKey: ['levels'], queryFn: getLevels });

    const mutation = useMutation({
        mutationFn: postLevel,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['levels'] })
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const [file, setFile] = useState<File>();
    const ci = useCompressedImage(file);

    async function handleFileChange(e:SyntheticEvent) {
        const f = e.target.files[0];
        if(f) setFile(f);
        
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        
    }


    return <div className="p-10">
        {
            isLoading && <div className="bg-yellow-600 p-2 text-white">Loading...</div>
        }
        {
            error && <div className="bg-red-600 p-2 text-white">Error: {error.message}</div>
        }
        <div className="flex items-center space-x-2">
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Levels</SelectLabel>
                        {
                            data && data.map((level: Level) => (
                                <SelectItem key={level.id} value={`${level.id}`}>{level.name}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <form onSubmit={handleSubmit}>
            <Input placeholder="Enter level number" type="number" required />
            <label>Select image</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <Button type="submit">ADD LEVEL</Button>
        </form>
        <div>
            <Command>
                <CommandInput placeholder="Select topic" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>Topic 1</CommandItem>
                        <CommandItem>Topic 2</CommandItem>
                        <CommandItem>Topic 3</CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                </CommandList>
            </Command>
        </div>
    </div>;
}
