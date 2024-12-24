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
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { Level } from "@/models/models";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SyntheticEvent, useState } from "react";
import { useCompressedImage } from "../compress-image";



const baseUrl = "http://localhost:3000";

export default function Grade() {

    const queryClient = useQueryClient();

    async function getLevels() {
        const res = await axios.get(`${baseUrl}/levels`);
        return res.data as Level[];
    }

    async function postLevel(data: FormData) {
        const config = {
            headers: {
              "content-type": "multipart/form-data"
            }
        };
        const res = await axios.post(`${baseUrl}/levels`, data, config);
        return res.data as Level;
    }

    const { data, isLoading, error } = useQuery({ queryKey: ['levels'], queryFn: getLevels });

    const mutation = useMutation({
        mutationFn: postLevel,
        onSuccess: (data, variables, context) => {
            console.log(data);
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['levels'] })
        },
        onError: (error, variables, context) => {
            console.log(error);
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter!
        },
    });

    const [file, setFile] = useState<File>();
    const ci = useCompressedImage(file);
    const [levelId, setLevelId] = useState<string>("");

    async function handleImageChange(e: SyntheticEvent) {
        const elm = e.target as HTMLInputElement;
        const f = elm.files![0];
        setFile(f);
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        const data = new FormData();
        data.append('id', levelId);
        if(ci) data.append('image', ci, file?.name);
        mutation.mutate(data);
    }


    return <div className="p-10">
        {
            isLoading && <div className="bg-yellow-600 p-2 text-white">Loading...</div>
        }
        {
            error && <div className="bg-red-600 p-2 text-white">Error: {error.message}</div>
        }

        {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null
        }
        {mutation.isSuccess ? <div>Level added!</div> : null}

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
            <Input 
            placeholder="Enter level number" 
            type="number" 
            name="level" 
            required 
            onChange={(e) => setLevelId(e.target.value)}
            />
            <label>Select image</label>
            <Input 
            type="file" 
            accept="image/*" 
            name="image" 
            onChange={handleImageChange} 
            />
            <Button type="submit">ADD LEVEL</Button>
        </form>
       
    </div>;
}
