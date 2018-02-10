FROM docker
RUN mkdir -p /var/run
COPY /var/run/docker.sock /var/run/docker.sock
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["sh"]
