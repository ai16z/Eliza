import type { Customizations, SpheronComputeConfig } from "../types/index.ts";

interface TemplateDefinition {
    description: string;
    config: (customizations?: any) => SpheronComputeConfig;
}

export const DEPLOYMENT_TEMPLATES: Record<string, TemplateDefinition> = {
    "jupyter-notebook": {
        description: "Jupyter Notebook environment for AI development",
        config: (customizations: Customizations) => ({
            name: "jupyter",
            image: customizations.cpu
                ? "jupyter/minimal-notebook:latest"
                : "quay.io/jupyter/pytorch-notebook:cuda12-pytorch-2.4.1",
            ports: [
                {
                    containerPort: 8888,
                    servicePort: 8888,
                },
            ],
            env: [
                {
                    name: "JUPYTER_TOKEN",
                    value: "spheron",
                },
            ],
            computeResources: {
                cpu: customizations.resources?.cpu || 4,
                memory: customizations.resources?.memory || "8Gi",
                storage: customizations.resources?.storage || "10Gi",
                ...(!customizations.cpu && {
                    gpu: {
                        count: customizations.resources?.gpu || 1,
                        model: customizations.resources?.gpu_model || "rtx4090",
                    },
                }),
            },
            duration: customizations.duration || "1d",
            token: customizations.token || "CST",
        }),
    },
    "ollama-webui": {
        description: "Ollama Web UI for managing and interacting with LLMs",
        config: (customizations: Customizations) => ({
            name: "ollama-webui",
            image: "ghcr.io/open-webui/open-webui:ollama",
            ports: [
                {
                    containerPort: 8080,
                    servicePort: 8080,
                },
                {
                    containerPort: 11434,
                    servicePort: 11434,
                },
            ],
            computeResources: {
                cpu: customizations.resources?.cpu || 4,
                memory: customizations.resources?.memory || "8Gi",
                storage: customizations.resources?.storage || "20Gi",
                ...(!customizations.cpu && {
                    gpu: {
                        count: customizations.resources?.gpu || 1,
                        model: customizations.resources?.gpu_model || "rtx4090",
                    },
                }),
            },
            duration: customizations.duration || "1d",
            token: customizations.token || "CST",
        }),
    },
    "vscode-pytorch": {
        description: "VS Code Server with PyTorch development environment",
        config: (customizations: Customizations) => ({
            name: "vscode",
            image: customizations.cpu
                ? "lscr.io/linuxserver/code-server"
                : "spheronnetwork/vscode-pytorch:latest",
            ports: [
                {
                    containerPort: 8443,
                    servicePort: 8443,
                },
            ],
            env: [
                {
                    name: "PASSWORD",
                    value: "spheron",
                },
            ],
            computeResources: {
                cpu: customizations.resources?.cpu || 4,
                memory: customizations.resources?.memory || "8Gi",
                storage: customizations.resources?.storage || "20Gi",
                ...(!customizations.cpu && {
                    gpu: {
                        count: customizations.resources?.gpu || 1,
                        model: customizations.resources?.gpu_model || "rtx4090",
                    },
                }),
            },
            duration: customizations.duration || "1d",
            token: customizations.token || "CST",
        }),
    },
    "heurist-miner": {
        description: "Heurist Miner for mining Heurist network",
        config: (customizations: Customizations) => ({
            name: "heurist-miner",
            image: "spheronnetwork/heurist-miner:latest",
            ports: [
                {
                    containerPort: 8888,
                    servicePort: 8888,
                },
            ],
            env: [
                {
                    name: "MINER_ID_0",
                    value: customizations.template?.heuristMinerAddress || "",
                },
                {
                    name: "LOG_LEVEL",
                    value: "INFO",
                },
            ],
            computeResources: {
                cpu: customizations.resources?.cpu || 8,
                memory: customizations.resources?.memory || "16Gi",
                storage: customizations.resources?.storage || "200Gi",
                ...(!customizations.cpu && {
                    gpu: {
                        count: customizations.resources?.gpu || 1,
                        model: customizations.resources?.gpu_model || "rtx4090",
                    },
                }),
            },
            duration: customizations.duration || "1d",
            token: customizations.token || "CST",
        }),
    },
};
