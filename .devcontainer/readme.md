## setup

### macOS

Because Docker for Mac [has a very bad IO performance on mounted volumes](https://github.com/docker/for-mac/issues/77) we are using an alternative approach with [NFS](https://en.wikipedia.org/wiki/Network_File_System):

* [Migrate from d4m-nfs to native Docker NFS Volumes](https://github.com/IFSight/d4m-nfs/issues/55)
* [Set Up Docker For Mac with Native NFS](https://medium.com/@sean.handley/how-to-set-up-docker-for-mac-with-native-nfs-145151458adc)
* [Docker for Mac Performance using NFS](https://www.vivait.co.uk/labs/docker-for-mac-performance-using-nfs)

It requires some setup steps to be run from the root of the project:

```
osascript -e 'quit app "Docker"'
echo "nfs.server.mount.require_resv_port = 0" | sudo tee -a /etc/nfs.conf
echo "$(PWD) localhost -alldirs -mapall=$(id -u):$(id -g)" | sudo tee -a /etc/exports
sudo nfsd restart
open -a Docker
```
