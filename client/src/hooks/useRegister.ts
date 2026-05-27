import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api";

export default function useRegister() {
    return useMutation({
        mutationFn: (data: { email: string; password: string }) => registerUser(data),
    });
}