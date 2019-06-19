## setup

### macOS

#### IO performance

Because Docker for Mac [has a very bad IO performance on mounted volumes](https://github.com/docker/for-mac/issues/77) we are using an alternative approach with [NFS](https://en.wikipedia.org/wiki/Network_File_System). It requires some setup steps to be run from the root of the project:

```sh
osascript -e 'quit app "Docker"'
echo "nfs.server.mount.require_resv_port = 0" | sudo tee -a /etc/nfs.conf
echo "$(PWD) localhost -alldirs -mapall=$(id -u):$(id -g)" | sudo tee -a /etc/exports
sudo nfsd restart
open -a Docker
```

Related links:

* [Migrate from d4m-nfs to native Docker NFS Volumes](https://github.com/IFSight/d4m-nfs/issues/55)
* [Set Up Docker For Mac with Native NFS](https://medium.com/@sean.handley/how-to-set-up-docker-for-mac-with-native-nfs-145151458adc)
* [Docker for Mac Performance using NFS](https://www.vivait.co.uk/labs/docker-for-mac-performance-using-nfs)

#### SSH/GPG agent

Because Docker for Mac [doesn't support sharing Unix sockets through mounted volumes](https://github.com/docker/for-mac/issues/483) it's [impossible to forward SSH socket from host](https://github.com/docker/for-mac/issues/410) (for example to be used with Git), or forward a GPG socket (for example to sign a Git commit). There is a quite tricky way to overcome the issue by using an SSH forwarding feature: to forward agent(s) with `ssh -A` to a special linux container and then mount socket(s) from it to the target container (this time it will work just fine between 2 linux containers, unlike the `osxfs` issue described above).

It's all wrapped in a single shell script that should be ran from the root of the project before anything else:

```sh
./.devcontainer/ssh-agent-forward.sh
```

Now a special `ssh-agent-forward` container should be up and running according to `docker ps -a`.

Later, to verify that everything is working fine inside of a devcontainer:

```sh
ssh-add -L
# and additionaly if you are using GPG:
gpg -K
```

If something went wrong or just didn't work with first try – cleanup things before you try again:

```sh
docker rm --force vscode-bubble-dev ssh-agent-forward
docker volume rm ssh-agent-forward
```

Run the shell script again and launch VSCode with a devcontainer.

Related links:

* [Docker container for SSH agent forwarding on OSX/Linux](https://github.com/nardeas/ssh-agent)
* [Forward SSH agent socket into a container](https://github.com/uber-common/docker-ssh-agent-forward)
