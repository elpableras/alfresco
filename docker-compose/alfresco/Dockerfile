#FROM alfresco/alfresco-content-repository-community:6.2.0-A11
FROM  alfresco/alfresco-content-repository-community:6.1.2-ga

USER 0  

# Add services configuration to alfresco-global.properties
RUN echo -e '\n\
#authentication.chain=alfrescoNtlm1:alfrescoNtlm\n\
#identity-service.authentication.enabled=true\n\
#identity-service.enable-basic-auth=true\n\
#identity-service.authentication.defaultAdministratorUserNames=none\n\
#identity-service.authentication.validation.failure.silent=false\n\
#identity-service.auth-server-url=https://keycloak.cern.ch/auth/realms/master\n\
#identity-service.realm=master\n\
#identity-service.resource=testalfresco\n\
#identity-service.public-client=true\n\
#identity-service.ssl-required=none\n\
\n\
' >> /usr/local/tomcat/shared/classes/alfresco-global.properties

# Extra software
RUN set -x \
	&& yum install -y \
	wget \
	unzip \
	&& yum clean all

RUN chmod 777 /usr/local/tomcat/shared/classes/alfresco-global.properties \
 && chmod 777 /usr/local/tomcat/webapps/alfresco/WEB-INF/classes/log4j.properties \
 && chmod -R 777 /usr/local/tomcat/alf_data

COPY share-oauth-repo/target/share-oauth-repo-2.3.0.jar /usr/local/tomcat/webapps/alfresco/WEB-INF/lib
