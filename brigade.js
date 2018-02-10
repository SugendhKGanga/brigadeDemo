const { events, Job, Group } = require("brigadier");

events.on("push", function(e, project) {
  console.log("received push for commit " + e.commit)
  
// Create a new job
	var build = new Job("job-image-build")
	var testing = new Job("job-testing")
	var deployment = new Job("job-deploy-helm")
	JobRunner(build)
    JobTesting(testing)
    JobDeployment(deployment)
	
// start pipeline
//    console.log(`==> starting pipeline for docker image: ${brigConfig.get("apiACRImage")}:${brigConfig.get("imageTag")}`)
    var pipeline = new Group()
    pipeline.add(build)
    pipeline.add(testing)
	pipeline.add(deployment)
	pipeline.runEach()
})
	
function JobRunner(g) {
// define job for build
    g.storage.enabled = false
    g.image = "sugendh/dockerindocker:1.0"
	g.privileged = true
    g.tasks = [
		"git clone https://github.com/gajadevops/kubeDemo.git",
		"cd kubeDemo",
		"dockerd-entrypoint.sh &",
		`docker build -t sugendh_nodejs:10.1 .`,
		`docker tag sugendh_nodejs:10.1 sugendh/nodejs:10.1`,
		`docker login -u sugendh -p Password123`,
		`sudo docker push sugendh/nodejs:10.1`		
    ]
}
	
	
function JobTesting(x) {
    // define job for testing
    x.storage.enabled = false
    x.image = "ubuntu"
    x.tasks = [
		"echo ToDo!"
    ]
}

function JobDeployment(y) {
    // define job for build
    y.storage.enabled = false
    y.image = "410602862282.dkr.ecr.us-east-2.amazonaws.com/demo-jenkins-pipeline:2.2"
    y.tasks = [
		"cd /opt/charts",
		`helm install --namespace jenkins --name my-jenkins-release -f stable/jenkins/values.yaml --set serviceType=LoadBalancer --set ImageTag=lts stable/jenkins`
    ]
}	
