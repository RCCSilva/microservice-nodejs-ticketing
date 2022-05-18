```shell
minikube start --driver=virtualbox
minikube ip
```

```shell
eval $(minikube docker-env)
```

```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=super-secret
minikube addons enable ingress
```

```shell
sudo nvim /etc/hosts
```

```shell
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=super-secret
```

## Digital Ocean

```shell
doctl kubernetes cluster kubeconfig save ticketing
```

```shell
kubectl config view
```

```shell
kubectl config use-context minikube
```