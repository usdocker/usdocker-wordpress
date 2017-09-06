# USDocker Generic Wordpress Server

This Useful Script creates a Wordpress server based on a Docker Image.
You don't know docker to use this solution.

It is easy to add your own plugins and themes. 

## Install USDocker Wordpress

```bash
npm install -g @usdocker/usdocker @usdocker/mysql @usdocker/wordpress
``` 

## Start the wordpress service

```
usdocker mysql up
usdocker wordpress up
```

## Stop the wordpress service 

```
usdocker wordpress down
```

## Check if the service is running

```
usdocker wordpress status
```

## Customize your service

You can setup the variables by using:

```bash
usdocker wordpress --set variable=value
```

Default values

 - image: "wordpress:4.8-php7.1",
 - folder: "$HOME/.usdocker/data/wordpress",
 - port: 8080,
 - db: "mysql-container",
 - dbUser: "root",
 - dbPassword: "password",
 - dbName: "wordpress",
 - dbTablePrefix: "",
 - enableDebug: "false"


## Customize the "$HOME/.usdocker/setup/wordpress/conf/uploads.ini"

Use your own setup for wordpress changing this file. 

```
file_uploads = On
memory_limit = 256M
upload_max_filesize = 256M
post_max_size = 300M
max_execution_time = 600
```
