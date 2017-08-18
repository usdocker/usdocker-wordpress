# USDocker Generic Wordpress Server

This Useful Script creates a Wordpress server based on a Docker Image.
You don't know docker to use this solution.

It is easy to add your own plugins and themes. 

## Install USDocker Wordpress

```bash
npm install -g usdocker-wordpress
``` 

## Start the wordpress service

```
usdocker mysql up         # Installed as a dependency
usdocker wordpress up
```

## Stop the wordpress service 

```
usdocker wordpress down
```

## Customize your service

You can setup the variables by using:

```bash
usdocker wordpress --set variable=value
```

Default values

 - image: "wordpress:4.8-php7.1",
 - folder: "/home/jg/.usdocker/data/wordpress",
 - pluginFolder: "/home/jg/.usdocker/data/wordpress/plugins",
 - themesFolder: "/home/jg/.usdocker/data/wordpress/themes",
 - uploadsFolder: "/home/jg/.usdocker/data/wordpress/uploads",
 - languagesFolder: "/home/jg/.usdocker/data/wordpress/languages",
 - port: 8080,
 - db: "mysql-container",
 - dbUser: "root",
 - dbPassword: "password"


## Customize the "$HOME/.usdocker/setup/wordpress/conf/uploads.ini"

Use your own setup for wordpress changing this file. 

```
file_uploads = On
memory_limit = 256M
upload_max_filesize = 256M
post_max_size = 300M
max_execution_time = 600
```
