#FROM alfresco/alfresco-share:6.2.0
FROM alfresco/alfresco-share:6.1.0-RC3

USER 0

# Extra software
RUN set -x \
        && yum install -y \
        wget \
        unzip \
        && yum clean all

COPY share-oauth/target/share-oauth-2.3.0.jar /usr/local/tomcat/webapps/share/WEB-INF/lib
